# השתמש בתמונה רשמית של node
FROM node:16

WORKDIR /app

# העתק את קבצי הפרויקט
COPY package*.json ./
RUN npm install
COPY . .

# חשוף את הפורט של Vite (למשל 5173)
EXPOSE 5173

CMD ["npm", "run", "dev"]
