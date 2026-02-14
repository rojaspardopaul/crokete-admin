#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_ID="crokete"
BUCKET_NAME="crokete-admin"
REGION="us-south1"

echo -e "${YELLOW}🚀 Desplegando Admin Frontend a Cloud Storage...${NC}\n"

# Verificar que estamos en el proyecto correcto
echo -e "${YELLOW}📋 Configurando proyecto GCP...${NC}"
gcloud config set project $PROJECT_ID

# Crear bucket si no existe
echo -e "${YELLOW}🪣 Verificando bucket de Cloud Storage...${NC}"
if ! gsutil ls gs://$BUCKET_NAME &> /dev/null; then
    echo -e "${YELLOW}Creando bucket gs://$BUCKET_NAME...${NC}"
    gsutil mb -p $PROJECT_ID -l $REGION gs://$BUCKET_NAME
    
    # Configurar bucket para hosting web estático
    gsutil web set -m index.html -e index.html gs://$BUCKET_NAME
    
    # Hacer el bucket público
    gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
else
    echo -e "${GREEN}✅ Bucket ya existe${NC}"
fi

# Ejecutar Cloud Build
echo -e "\n${YELLOW}🏗️  Iniciando Cloud Build...${NC}"
gcloud builds submit --config=cloudbuild.yaml .

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Despliegue exitoso!${NC}"
    echo -e "${GREEN}🌐 URL del bucket: http://$BUCKET_NAME.storage.googleapis.com${NC}"
    echo -e "${YELLOW}📝 Siguiente paso: Configurar Load Balancer y dominio personalizado${NC}"
else
    echo -e "\n${RED}❌ Error en el despliegue${NC}"
    exit 1
fi
