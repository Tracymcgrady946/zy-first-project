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

function withProjectMediaFallback(locale, projects) {
  if (!Array.isArray(projects)) return projects

  const localProjects = mock.getMockProjects(locale)
  const localByKey = new Map(localProjects.map(project => [project.key, project]))
  const localByName = new Map(localProjects.map(project => [project.name, project]))

  return projects.map(project => {
    if (Array.isArray(project.media) && project.media.length) return project

    const localProject = localByKey.get(project.key) || localByName.get(project.name)
    if (!localProject?.media?.length) return project

    return {
      ...project,
      media: localProject.media
    }
  })
}

async function getProjects(locale) {
  const projects = await get(`/projects?locale=${locale}`)
  return withProjectMediaFallback(locale, projects)
}

export const api = {
  getProfile:    maybeMock((locale) => get(`/profile?locale=${locale}`), mock.getMockProfile),
  getNav:        maybeMock((locale) => get(`/nav?locale=${locale}`), mock.getMockNav),
  getSections:   maybeMock((locale) => get(`/sections?locale=${locale}`), mock.getMockSections),
  getConfig:     maybeMock(() => get('/config'), mock.getMockConfig),
  getTechLinks:  maybeMock(() => get('/tech-links'), mock.getMockTechLinks),
  getProjects:   maybeMock(getProjects, mock.getMockProjects),
  getTimeline:   maybeMock((locale) => get(`/timeline?locale=${locale}`), mock.getMockTimeline),
  getOnFootHikes: maybeMock((locale) => get(`/on-foot?locale=${locale}`), mock.getMockOnFootHikes),
  getBooks:      maybeMock(() => get('/books'), mock.getMockBooks),
  getAiDynamics: maybeMock(() => get('/ai'), mock.getMockAiDynamics),
  getQuotes:     maybeMock((locale) => get(`/quotes?locale=${locale}`), mock.getMockQuotes),
}
