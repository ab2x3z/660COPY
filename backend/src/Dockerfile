# Utiliser une image Python officielle
FROM python:3.11-slim

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    libaio1 \
    gcc \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Créer le répertoire pour le client Oracle
RUN mkdir -p /opt/oracle
WORKDIR /opt/oracle

# Télécharger et installer le client Oracle Instant Client
RUN wget https://download.oracle.com/otn_software/linux/instantclient/218000/instantclient-basic-linux.x64-21.8.0.0.0dbru.zip \
    && unzip instantclient-basic-linux.x64-21.8.0.0.0dbru.zip \
    && rm instantclient-basic-linux.x64-21.8.0.0.0dbru.zip \
    && sh -c "echo /opt/oracle/instantclient_21_8 > /etc/ld.so.conf.d/oracle-instantclient.conf" \
    && ldconfig

# Définir les variables d'environnement pour Oracle
ENV ORACLE_HOME=/opt/oracle/instantclient_21_8
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_21_8:$LD_LIBRARY_PATH
ENV PATH=/opt/oracle/instantclient_21_8:$PATH

# Créer et définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de requirements
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port sur lequel FastAPI va tourner
EXPOSE 8000

# Commande pour démarrer l'application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]