export default function getEnv(name) {
    console.log( window?.configs?.[name]);
  return window?.configs?.[name] || process.env[name]
}