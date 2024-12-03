
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_PRIVATE_KEY: string
  readonly VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL: string
  readonly VITE_GOOGLE_SPREADSHEET_ID: string
}VITE_APPS_SCRIPT_URL='ваш_url_скрипта'

interface ImportMeta {
  readonly env: ImportMetaEnv
}