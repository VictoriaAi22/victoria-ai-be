module.exports = ({ env }) => ({
  // ...
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  // ...
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        port: env("SMTP_PORT", 587),
        service: "gmail",
        secure: false,
        debug: true,
        ignoreTLS: true,
        auth: {
          user: env("SMTP_USERNAME"),
          pass: env("SMTP_PASSWORD"),
        },
      },
    },
  },
  //..
  graphql: {
    enabled: true,
    config: {
      endpoint: "/graphql",
      shadowCRUD: true,
      playgroundAlways: true,
      defaultLimit: 10,
      maxLimit: 20,
      apolloServer: {
        tracing: true,
      },
    },
  },
  // ...
  ckeditor: {
    enabled: true,
    config: {
      plugin: {
        toolbar: {
          items: [
            "bulletedList",
            "numberedList",
            "|",
            "link",
            "|",
            "superscript",
            "strikethrough",
            "specialCharacters",
            "|",
            "indent",
            "|",
            "undo",
            "redo",
          ],
        },
      },
    },
  },
  // ...
});
