FROM node:14.17.4

# Create app directory
WORKDIR /usr/src/uenf-academy-api

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available
COPY package*.json yarn.lock ./

# Run yarn without generating a yarn.lock file
RUN yarn --pure-lockfile

# Bundle app source
COPY . .

ENV MONGO_URI="mongodb+srv://leonardondm:CFJCbnmed21jh75S@cluster0.gu2gdsd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
ENV JWT_KEY="3af7d89e792af1b84d9010c8f8327c2e1184e3316b05b4fe589e6e2d480dc0a2"
ENV PORT=9001
# Use the port used by our server.js configuration
EXPOSE 9001

CMD ["yarn", "start"]
