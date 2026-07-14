FROM mcr.microsoft.com/playwright/python:v1.44.0-jammy

WORKDIR /app

# Copy Georgia fonts so Chromium can render them
COPY fonts/ /usr/share/fonts/truetype/msttcorefonts/
RUN fc-cache -fv

# Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Node dependencies (playwright already installed in base image)
COPY package.json .
RUN npm install

# Copy everything
COPY . .

EXPOSE 8000
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
