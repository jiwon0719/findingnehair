FROM node:18-alpine

ARG VITE_KAKAO_API_KEY
ARG VITE_BASE_URL
ARG VITE_KAKAO_REDIRECT_URI

ENV VITE_KAKAO_API_KEY=$VITE_KAKAO_API_KEY
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_KAKAO_REDIRECT_URI=$VITE_KAKAO_REDIRECT_URI

WORKDIR /app

ARG MODE=dev
ENV MODE=$MODE

COPY package*.json ./
RUN npm install

COPY . .

RUN if [ "$MODE" = "prod" ]; then npm run build; fi

CMD if [ "$MODE" = "prod" ]; then \
      npm install -g serve && serve -s dist -l 3000; \
    else \
      npm run dev -- --host; \
    fi
