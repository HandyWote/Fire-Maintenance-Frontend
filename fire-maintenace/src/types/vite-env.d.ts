/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_ENV: 'development' | 'production' | 'test'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly hot: {
    accept(cb?: (mod: any) => void): void
    accept(dep: string, cb: (mod: any) => void): void
    acceptDeps(deps: string[], cb: (mods: any[]) => void): void
    dispose(cb: (data: any) => void): void
    decline(): void
    invalidate(): void
    on(event: string, cb: (...args: any[]) => void): void
    off(event: string, cb: (...args: any[]) => void): void
  }
}
