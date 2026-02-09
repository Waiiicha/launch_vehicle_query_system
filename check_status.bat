@echo off
chcp 65001 >nul
echo ====================================
echo   运载火箭查询系统 - 状态检查
echo ====================================
echo.

echo [1/4] 检查目录结构...
if exist "server" (
    echo ✓ server 目录存在
) else (
    echo ✗ server 目录不存在
)

if exist "client" (
    echo ✓ client 目录存在
) else (
    echo ✗ client 目录不存在
)

if exist "pic\rocket_pic" (
    echo ✓ pic\rocket_pic 目录存在
) else (
    echo ✗ pic\rocket_pic 目录不存在
)

if exist "pic\engine_pic" (
    echo ✓ pic\engine_pic 目录存在
) else (
    echo ✗ pic\engine_pic 目录不存在
)

echo.
echo [2/4] 检查图片文件...
cd pic\rocket_pic
for /f %%a in ('dir /b *.jpg *.jpeg *.png *.webp 2^>nul ^| find /c /v ""') do set rocket_count=%%a
cd ..\..
echo 火箭图片数量: %rocket_count% 张

cd pic\engine_pic
for /f %%a in ('dir /b *.jpg *.jpeg *.png *.webp 2^>nul ^| find /c /v ""') do set engine_count=%%a
cd ..\..
echo 发动机图片数量: %engine_count% 张

echo.
echo [3/4] 检查数据库...
if exist "server\prisma\dev.db" (
    echo ✓ 数据库文件存在
    cd server
    sqlite3 prisma\dev.db "SELECT '火箭总数: ' || COUNT(*) FROM Rocket UNION ALL SELECT '有图片的火箭: ' || COUNT(*) FROM Rocket WHERE imageUrl IS NOT NULL UNION ALL SELECT '发动机总数: ' || COUNT(*) FROM Engine UNION ALL SELECT '有图片的发动机: ' || COUNT(*) FROM Engine WHERE imageUrl IS NOT NULL;"
    cd ..
) else (
    echo ✗ 数据库文件不存在，请运行: cd server ^&^& npm run seed
)

echo.
echo [4/4] 检查前端导出数据...
if exist "client\src\data\rockets.json" (
    echo ✓ rockets.json 已导出
) else (
    echo ✗ rockets.json 未导出，请运行: cd server ^&^& npm run export
)

if exist "client\src\data\engines.json" (
    echo ✓ engines.json 已导出
) else (
    echo ✗ engines.json 未导出，请运行: cd server ^&^& npm run export
)

if exist "client\public\images\rockets" (
    cd client\public\images\rockets
    for /f %%a in ('dir /b *.jpg *.jpeg *.png *.webp 2^>nul ^| find /c /v ""') do set exported_rockets=%%a
    cd ..\..\..\..
    echo 已导出火箭图片: %exported_rockets% 张
) else (
    echo ✗ 火箭图片未导出
)

if exist "client\public\images\engines" (
    cd client\public\images\engines
    for /f %%a in ('dir /b *.jpg *.jpeg *.png *.webp 2^>nul ^| find /c /v ""') do set exported_engines=%%a
    cd ..\..\..\..
    echo 已导出发动机图片: %exported_engines% 张
) else (
    echo ✗ 发动机图片未导出
)

echo.
echo ====================================
echo   检查完成
echo ====================================
echo.
echo 如果发现问题，请参考 README.md 中的故障排查部分
echo 或查看 doc\IMAGE_MANAGEMENT.md 了解图片管理详情
echo.
pause
