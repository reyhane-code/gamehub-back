FROM mortezahatamikia/base-node

WORKDIR /gamehub/src/app

COPY package.json ./

# COPY yarn.lock ./

RUN yarn install

COPY ./ ./

EXPOSE 5000

CMD npm run start:dev && npm run migrate