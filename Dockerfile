FROM risingstack/alpine:3.7-v8.10.0-4.8.0

EXPOSE 3002

COPY package.json package.json

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/"]