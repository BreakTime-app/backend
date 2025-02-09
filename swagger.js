const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "공강 시간표 API",
      version: "1.0.0",
      description: "대학생 공강 시간표 관리 API 문서",
    },
    servers: [
      {
        url: "http://localhost:5000", // 서버 URL (배포 시 변경)
      },
    ],
  },
  apis: ["./routes/*.js"], // API 문서화할 파일들
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
