// 天气数据类型
export interface WeatherData {
  id: string;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  dt: number;
}

// 天气预报数据类型
export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
  }>;
}

// 全球天气数据类型
export interface GlobalWeatherData {
  grid: Array<{
    lat: number;
    lon: number;
    temp: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
  }>;
}

// 地点搜索结果类型
export interface LocationSearchResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

// 极端天气事件类型
export interface ExtremeWeatherEvent {
  id: string;
  type: string;
  location: {
    lat: number;
    lon: number;
  };
  severity: string;
  description: string;
}

// 用户设置类型
export interface UserSettings {
  savedLocations: Array<{
    name: string;
    lat: number;
    lon: number;
  }>;
  defaultView: {
    lat: number;
    lon: number;
    zoom: number;
  };
  dataPreferences: {
    defaultDataDimension: 'temperature' | 'precipitation' | 'wind' | 'pressure';
    temperatureUnit: 'celsius' | 'fahrenheit';
  };
  theme: 'light' | 'dark';
  performance: {
    renderQuality: 'low' | 'medium' | 'high';
  };
}

// 数据维度类型
export type DataDimension = 'temperature' | 'precipitation' | 'wind' | 'pressure';

// 时间范围类型
export type TimeRange = '24h' | '7d' | '30d';