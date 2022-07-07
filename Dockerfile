FROM node:16
ENV NODE_ENV production
ENV DB_URL='mongodb+srv://<Username>:<Password>@cluster0.ushjf.mongodb.net/vfsServices-dockered?retryWrites=true&w=majority'
ENV VFS_EMAIL=
ENV VFS_PASSWORD=
ENV SENDGRID_API_KEY=
ENV SENDER_EMAIL=
ENV RECEIVER_EMAIL=
ENV SOURCE_COUNTRY='ind'
ENV DESTINATION_COUNTRY='nld'
ENV PORT=5122
RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable \
     && apt-get install -y xvfb \
     && rm -rf /var/lib/apt/lists/* \
     && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
     && chmod +x /usr/sbin/wait-for-it.sh
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm ci --only=production
COPY . .
EXPOSE 5122
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
