import { BaseConfig } from "../configs/base";

export class ProductionConfig extends BaseConfig {
    YOUTUBE_API_KEY = 'AIzaSyA0IVcbUcLV3N5zoJ1TLS1FEz2eDcEV6Ic';
    BASE_URL = `/api`;
    PUSHER_URL = `/api`;
    PUSHER_NAMESPACE = 'soundchat';
    PUSHER_KEY = '212af40d49e82f344e49'
}
