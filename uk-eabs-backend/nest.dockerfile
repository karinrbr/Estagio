FROM node:14-bullseye as development

WORKDIR /nest

# Install PNPM
RUN npm install -g pnpm

COPY package.json /nest/package.json
COPY pnpm-lock.yaml /nest/pnpm-lock.yaml

# RUN npm install --only=development
RUN pnpm install

COPY . .

RUN pnpm run prebuild

RUN pnpm run build


# FROM node:14-buster as production

# WORKDIR /usr/local

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# COPY package*.json ./

# RUN npm install --production

# COPY --from=development /nest/dist /usr/local/dist
