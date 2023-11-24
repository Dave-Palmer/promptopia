'use client'

import {useState, useEffect} from 'react'

import PromptCard from './PromptCard'

const PromptCardList = ({ data, handleTagClick}) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />
      ))}
    </div>
  )
}

const Feed = () => {

  const [posts, setPosts] = useState([])

  //For filtered search
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchTimeout, setSearchTimeout] = useState(null)

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, 'i')
    return posts.filter((item) => 
      regex.test(item.creator.username) ||
      regex.test(item.tag) ||
      regex.test(item.prompt)
    )
  }

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout)
    setSearchText(e.target.value)
    setSearchTimeout(
      setTimeout(() => {
       const searchedResult = filterPrompts(e.target.value);
       setSearchResults(searchedResult)
      }, 800)
    )  
  }

    const fetchPosts = async () => {
      const response = await fetch('/api/prompt')
      const data = await response.json()

      setPosts(data)
    }

  useEffect(() => {
    fetchPosts()
  },[])

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input 
          className='search_input peer'
          type="text" 
          placeholder='Filter by keyword or tag'
          value={searchText}
          onChange={handleSearchChange}
          required
        />
      </form>
      <PromptCardList
        data={searchText ? searchResults : posts}
        handleTagClick={() => {}}
      />
    </section>
  )
}

export default Feed