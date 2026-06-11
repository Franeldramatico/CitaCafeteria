param(
  [string]$RepoUrl = "https://github.com/Franeldramatico/CitaCafeteria.git",
  [string]$BranchName = "gh-pages"
)

Write-Host "=== Deploy a GitHub Pages ===" -ForegroundColor Cyan
Write-Host ""

# 1. Build
Write-Host "[1/4] Build de produccion..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Host "ERROR: Fallo el build" -ForegroundColor Red
  exit 1
}
Write-Host "Build exitoso!" -ForegroundColor Green
Write-Host ""

# 2. Crear .nojekyll (evita que Jekyll procese _directorios)
Write-Host "[2/4] Creando .nojekyll..." -ForegroundColor Yellow
New-Item -ItemType File -Path "dist\.nojekyll" -Force | Out-Null
Write-Host "OK" -ForegroundColor Green
Write-Host ""

# 3. Inicializar repo temporal en dist/ y pushear a gh-pages
Write-Host "[3/4] Pusheando a $BranchName ..." -ForegroundColor Yellow
Set-Location -LiteralPath "dist"

git init
git checkout -b $BranchName
git add -A
git commit -m "deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

git remote add origin $RepoUrl
git push -f origin $BranchName

Set-Location -LiteralPath ".."
Write-Host "Push completado!" -ForegroundColor Green
Write-Host ""

# 4. Limpiar
Write-Host "[4/4] Limpieza..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
Write-Host "OK" -ForegroundColor Green
Write-Host ""

Write-Host "=== Deploy finalizado! ===" -ForegroundColor Cyan
Write-Host "Disponible en: https://franeldramatico.github.io/CitaCafeteria/" -ForegroundColor Magenta
