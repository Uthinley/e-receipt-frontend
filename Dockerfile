FROM node:14-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
COPY src/environments/environment.aws.ts ./src/environments/environment.ts
RUN npm run build --prod

FROM nginx:stable-alpine
COPY --from=build /app/dist/DessungSkillingProgram /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]