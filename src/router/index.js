import { createRouter, createWebHistory } from 'vue-router'
import EditorView from '../views/EditorView.vue'
import PreviewView from '../views/PreviewView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'editor',
      component: EditorView
    },
    {
      path: '/preview',
      name: 'preview',
      component: PreviewView
    }
  ]
})

export default router 