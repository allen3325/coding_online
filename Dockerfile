# 使用 Node.js 官方映像作為基礎映像
FROM node:14

# 全域安裝 serve 套件和 react-scripts
RUN npm install -g serve react-scripts

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 以進行安裝相依套件
COPY package*.json ./

# 安裝相依套件並建置 React 應用程式
RUN npm install

# 複製整個專案到容器中
COPY . /app

RUN npm run build

# 開啟靜態伺服器
CMD ["serve", "-s", "build"]
