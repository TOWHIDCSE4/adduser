/// <reference types="next" />
/// <reference types="next/types/global" />

declare module 'enquire-js' {
    function enquireScreen(params?: any): any
    function unenquireScreen(params?: any): any
}
declare module '@ngochipx/nhfinder/reactjs' {
    function NHFinder(props?: any): any
}
/* declare module "js-base64";
declare module "node-fetch";
declare module "@ant-design/icons";
declare module "await-to-js";
declare module "lodash";
declare module "antd";
declare module "next/dynamic";
declare module "react";
declare module "form-urlencoded";
 */  
interface Context {
    readonly pathname: string;
    readonly query: string;
    readonly asPath: string;
    readonly req: http.IncomingMessage;
    readonly res: http.ServerResponse;
    readonly jsonPageRes: Response;
    readonly err: any;
}

interface GridTable{
    getOptions: Function
    reload: Function
}  

interface FilterParam{
    column: any,
    confirm: Function,
    ref: any
}