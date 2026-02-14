# Script de despliegue para Admin Frontend en PowerShell

$PROJECT_ID = "crokete"
$BUCKET_NAME = "crokete-admin"
$REGION = "us-south1"

Write-Host "`n🚀 Desplegando Admin Frontend a Cloud Storage...`n" -ForegroundColor Yellow

# Configurar proyecto
Write-Host "📋 Configurando proyecto GCP..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# Verificar si el bucket existe
Write-Host "🪣 Verificando bucket de Cloud Storage..." -ForegroundColor Yellow
$bucketExists = gsutil ls gs://$BUCKET_NAME 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Creando bucket gs://$BUCKET_NAME..." -ForegroundColor Yellow
    gsutil mb -p $PROJECT_ID -l $REGION gs://$BUCKET_NAME
    
    # Configurar bucket para hosting web estático
    gsutil web set -m index.html -e index.html gs://$BUCKET_NAME
    
    # Hacer el bucket público
    gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
} else {
    Write-Host "✅ Bucket ya existe" -ForegroundColor Green
}

# Ejecutar Cloud Build
Write-Host "`n🏗️  Iniciando Cloud Build...`n" -ForegroundColor Yellow
gcloud builds submit --config=cloudbuild.yaml .

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Despliegue exitoso!" -ForegroundColor Green
    Write-Host "🌐 URL del bucket: http://$BUCKET_NAME.storage.googleapis.com" -ForegroundColor Green
    Write-Host "📝 Siguiente paso: Configurar Load Balancer y dominio personalizado" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Error en el despliegue" -ForegroundColor Red
    exit 1
}
