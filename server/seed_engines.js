const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const XLSX = require('xlsx');
const path = require('path');

// 1. 燃料翻译与标准化字典
const propMap = {
    'LOX': '液氧', 'RP-1': '煤油', 'LH2': '液氢', 'LCH4': '甲烷', 'CH4': '甲烷',
    'MMH': '甲肼', 'UDMH': '偏二甲肼', 'NTO': '四氧化二氮', 'H2O2': '过氧化氢',
    ' kerosene': '煤油', 'Methane': '甲烷', 'Hydrogen': '液氢', 'Oxygen': '液氧',
    'Kerosene': '煤油'
};

const normalizePropellant = (raw) => {
    if (!raw) return null;
    let text = String(raw).trim();
    Object.keys(propMap).forEach(key => {
        const reg = new RegExp(key, 'gi');
        text = text.replace(reg, propMap[key]);
    });
    const keywords = ['液氧', '煤油', '甲烷', '液氢', '甲肼', '偏二甲肼', '四氧化二氮', '过氧化氢', '固体'];
    const found = keywords.filter(k => text.includes(k));
    
    // Sort: Oxidizer first
    found.sort((a, b) => {
        if (['液氧', '四氧化二氮'].includes(a)) return -1;
        if (['液氧', '四氧化二氮'].includes(b)) return 1;
        return 0;
    });

    return found.length > 0 ? found.join(' / ') : text.replace(/[+&]/g, ' / ');
};

// 2. 厂商与国家映射
const manufacturerMap = [
    { key: 'SpaceX', name: 'SpaceX', country: '美国' },
    { key: '九州', name: '九州云箭', country: '中国' },
    { key: '蓝箭', name: '蓝箭航天', country: '中国' },
    { key: '星河', name: '星河动力', country: '中国' },
    { key: '天兵', name: '天兵科技', country: '中国' },
    { key: '深蓝', name: '深蓝航天', country: '中国' },
    { key: '中科', name: '中科宇航', country: '中国' },
    { key: '东方', name: '东方空间', country: '中国' },
    { key: '宇石', name: '宇石空间', country: '中国' },
    { key: '星际', name: '星际荣耀', country: '中国' },
    { key: '六院', name: '航天六院', country: '中国' },
    { key: 'AALPT', name: '航天六院', country: '中国' },
];

const resolveManufacturer = (raw) => {
    if (!raw) return { name: '未知', country: '未知' };
    let r = String(raw).trim();
    if (r === '九州箭云') r = '九州云箭';
    
    const match = manufacturerMap.find(m => r.includes(m.key) || r.includes(m.name));
    if (match) return { name: match.name, country: match.country };
    
    if (/[一-龥]/.test(r)) return { name: r, country: '中国' };
    return { name: r, country: '国际' };
};

// 3. 名称清洗 (处理换行符)
const cleanName = (raw) => {
    if (!raw) return raw;
    let n = String(raw).trim();
    n = n.replace(new RegExp('[\\r\\n]+', 'g'), ' '); 
    n = n.replace(/\s+/g, ' ');
    return n.trim();
};

const cleanValue = (val) => (val === undefined || val === null) ? null : String(val).trim().replace(/[\[\]\d+\]/g, '');

const hardcodedSpecs = {
    'YF-100K': { description: '中国新一代载人运载火箭主力发动机，采用泵后摆技术。' },
    'Raptor 2': { description: 'SpaceX星舰使用的全流量分级燃烧循环发动机。' },
    'YF-209': { description: '航天六院发布的商业液氧甲烷发动机，支持多次重复使用。' },
    'YF-215': { description: '全流量分级燃烧循环液氧甲烷发动机，推力达200吨级。' }
};

async function main() {
    console.log('正在严格按照第一个表格整合 18 个发动机型号...');
    const filePath = path.join(__dirname, '../doc/火箭发动机.xlsx');
    const workbook = XLSX.readFile(filePath);

    await prisma.engine.deleteMany({});
    console.log('现有数据库已清空。');

    let enginesCount = 0;

    const upsertEngine = async (data) => {
        if (!data.name || data.name.includes('型号')) return;

        data.name = cleanName(data.name);
        const manuInfo = resolveManufacturer(data.manufacturer);
        data.manufacturer = manuInfo.name;
        data.country = manuInfo.country;
        data.propellant = normalizePropellant(data.propellant);

        if (data.thrust && !isNaN(parseFloat(data.thrust))) data.thrust += ' kN';
        if (data.weight && !isNaN(parseFloat(data.weight))) data.weight += ' kg';

        if (data.twRatio && (data.twRatio.includes('°') || data.twRatio.includes('角度') || data.twRatio.includes('±'))) {
            if (!data.gimbalAngle) data.gimbalAngle = data.twRatio;
            data.twRatio = null;
        }

        if (hardcodedSpecs[data.name] && !data.description) {
            data.description = hardcodedSpecs[data.name].description;
        }

        try {
            await prisma.engine.create({ data: data });
            enginesCount++;
            console.log(`入库成功: ${data.name}`);
        } catch (e) {
            console.error(`入库失败 ${data.name}:`, e.message);
        }
    };

    const sheet = workbook.Sheets['国内发动机'];
    if (sheet) {
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const headerIndex = rows.findIndex(r => r.some(c => String(c).includes('芯一级发动机')));
        
        if (headerIndex !== -1) {
            const headers = rows[headerIndex].map(h => String(h || '').trim());
            for (let i = headerIndex + 1; i < rows.length; i++) {
                const row = rows[i];
                if (!row || !row[0]) continue;

                const d = {};
                headers.forEach((h, idx) => {
                    const val = cleanValue(row[idx]);
                    if (h.includes('芯一级发动机')) d.name = val;
                    if (h.includes('推进剂')) d.propellant = val;
                    if (h.includes('研制单位')) d.manufacturer = val;
                    if (h.includes('海平面推力')) d.thrust = val;
                    if (h.includes('海平面比冲')) d.specificImpulse = val;
                    if (h.includes('启动次数')) d.restartCount = val;
                    if (h.includes('发动机重量')) d.weight = val;
                    if (h.includes('推重比')) d.twRatio = val;
                    if (h.includes('推力调节')) d.throttleRange = val;
                    if (h.includes('最大摇摆角度')) d.gimbalAngle = val;
                    if (h.includes('使用型号')) d.usedBy = val;
                    if (h.includes('现有成组方式')) d.clustering = val;
                    if (h.includes('750t所需数量')) d.neededFor750t = val;
                    if (h.includes('7500t所需数量')) d.neededFor7500t = val;
                    if (h.includes('链接')) d.description = val;
                });
                await upsertEngine(d);
            }
        }
    }
    console.log(`入库结束。共计处理: ${enginesCount} 个型号。`);
}

main().finally(async () => {
    await prisma.$disconnect();
});