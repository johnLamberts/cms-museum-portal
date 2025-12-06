/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/extensions/video/video-embed.ts
import { mergeAttributes, Node } from '@tiptap/core'

export interface VideoEmbedOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoEmbed: {
      /**
       * Add a video embed node
       */
      setVideoEmbed: (options: { src: string, provider: string, videoId: string }) => ReturnType,
    }
  }
}

export const VideoEmbed = Node.create<VideoEmbedOptions>({
  name: 'videoEmbed',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'video-embed',
      },
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      provider: {
        default: null,
      },
      videoId: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: '400px',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-video-embed]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { provider, videoId, width, height } = HTMLAttributes
    
    let embedHtml = ''
    
    if (provider === 'youtube' && videoId) {
      embedHtml = `<iframe 
        width="${width}" 
        height="${height}" 
        src="https://www.youtube.com/embed/${videoId}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
      ></iframe>`
    } else if (provider === 'vimeo' && videoId) {
      embedHtml = `<iframe 
        width="${width}" 
        height="${height}" 
        src="https://player.vimeo.com/video/${videoId}" 
        frameborder="0" 
        allow="autoplay; fullscreen; picture-in-picture" 
        allowfullscreen
      ></iframe>`
    }
    
    return [
      'div',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        { 
          'data-video-embed': '',
          style: 'position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;'
        }
      ),
      embedHtml,
    ]
  },

  addCommands() {
    return {
      setVideoEmbed: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})
