module.exports = {
  apps: [
    {
      name: "pastebin",
      script: "npm",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 42928,
      },
    },
  ],
};
