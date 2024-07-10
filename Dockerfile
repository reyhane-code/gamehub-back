FROM mortezahatamikia/base-node

WORKDIR /gamehub/src/app

COPY package.json ./

# COPY yarn.lock ./

RUN yarn install

COPY ./ ./

EXPOSE 3500

CMD npm run start:dev && npm run migrate && npm run seed