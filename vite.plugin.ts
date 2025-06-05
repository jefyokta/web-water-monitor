import { existsSync,  unlinkSync, writeFileSync } from "fs"
import path from "path"
import { type ViteDevServer } from "vite"



export const HotPlugin = ():HotPluginReturn=>{

    const hotFile = path.resolve("./public/hot")
    const cleanUp = () => existsSync(hotFile) ? unlinkSync(hotFile) : null
process.on("SIGINT",()=>{
        cleanUp()
        process.exit()
    })
process.on("exit", cleanUp);

return {
    name:"hot",
    configureServer(server) {
     const {host,port,}=   server.config.server
     writeFileSync(hotFile,`http://${host}:${port}`, "utf-8")
        
    },
    
}
}

type HotPluginReturn = {
  name: string;
  configureServer: (server: ViteDevServer) => void;
};