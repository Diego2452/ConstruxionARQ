# show-structure.ps1
# Corré con: .\show-structure.ps1
# Muestra la estructura del proyecto y contenido de archivos clave

$root = Get-Location

Write-Host "`n=== ESTRUCTURA DEL PROYECTO ===" -ForegroundColor Cyan
Get-ChildItem -Recurse -Path $root |
  Where-Object {
    $_.FullName -notmatch "node_modules|\.next|out|\.git" -and
    $_.Name -notmatch "package-lock\.json"
  } |
  ForEach-Object {
    $rel = $_.FullName.Replace($root.Path, "").Replace("\", "/")
    if ($_.PSIsContainer) {
      Write-Host "📁 $rel" -ForegroundColor Yellow
    } else {
      Write-Host "📄 $rel"
    }
  }

Write-Host "`n=== ARCHIVOS CLAVE ===" -ForegroundColor Cyan

$files = @(
  "next.config.mjs",
  "package.json",
  "src/app/layout.tsx",
  "src/data/projects.ts",
  "src/components/Navbar.tsx",
  "src/components/ProjectContent.tsx",
  "src/app/proyectos/page.tsx",
  "src/app/proyectos/[slug]/page.tsx",
  ".github/workflows/deploy.yml"
)

foreach ($f in $files) {
  $fullPath = Join-Path $root $f
  if (Test-Path $fullPath) {
    Write-Host "`n--- $f ---" -ForegroundColor Green
    Get-Content $fullPath
  } else {
    Write-Host "`n--- $f --- (NO ENCONTRADO)" -ForegroundColor Red
  }
}