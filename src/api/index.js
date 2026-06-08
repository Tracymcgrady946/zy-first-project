import { useBackend } from '@/config/dataSource.js'
import * as mock from '@/mock/data.js'

const API_BASE = '/api'

async function get(path) {
  const res = await fetch(API_BASE + path)
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json()
}

function maybeMock(fn, mockFn) {
  return useBackend ? fn : (...args) => Promise.resolve(mockFn(...args))
}

export const api = {
  getProfile:    maybeMock((locale) => get(`/profile?locale=${locale}`), mock.getMockProfile),
  getNav:        maybeMock((locale) => get(`/nav?locale=${locale}`), mock.getMockNav),
  getSections:   maybeMock((locale) => get(`/sections?locale=${locale}`), mock.getMockSections),
  getConfig:     maybeMock(() => get('/config'), mock.getMockConfig),
  getTechLinks:  maybeMock(() => get('/tech-links'), mock.getMockTechLinks),
  getProjects:   maybeMock((locale) => get(`/projects?locale=${locale}`), mock.getMockProjects),
  getTimeline:   maybeMock((locale) => get(`/timeline?locale=${locale}`), mock.getMockTimeline),
  getBooks:      maybeMock(() => get('/books'), mock.getMockBooks),
  getAiDynamics: maybeMock(() => get('/ai'), mock.getMockAiDynamics),
}
