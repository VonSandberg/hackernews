"use strict"

const axios = require('axios')

const api = 'https://hacker-news.firebaseio.com/v0'

let stories = []

Array.prototype.forEachAsyncParallel = async function (fn) {
  await Promise.all(this.map(fn));
}

async function fetchNewStories () {
  const { data } = await axios.get(api + '/topstories.json')
  const limitedStories = data.slice(0, 100)
  return limitedStories
}

async function fetchStory (id) {
  const { data } = await axios.get(`${api}/item/${id}.json`)
  return {
    id: data.id,
    author: data.by,
    title: data.title,
    externalUrl: data.url,
    internalUrl: 'https://news.ycombinator.com/item?id=' + id,
    createdAt: new Date(data.time)
  }
}

async function run () {
  const ids = await fetchNewStories()

  await ids.forEachAsyncParallel(async (id) => {
    const story = await fetchStory(id)
    stories.push(story)
  })

  console.log(stories)
}

run()
