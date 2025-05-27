# בחר את התמונה הרשמית ל-Node.js
FROM node:16

# הגדרת תיקיית עבודה בתוך הקונטיינר
WORKDIR /usr/src/server

# העתק את קבצי הפרויקט (package.json, package-lock.json)
COPY package*.json ./

# התקנת התלויות
RUN npm install

# העתק את שאר קבצי הקוד
COPY . .

# חשוף את הפורט שעליו רץ השרת (כמו 3000)
EXPOSE 3000

# הפעל את השרת
CMD ["node", "server.js"]
