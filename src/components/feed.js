import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { readClient } from '../client'
import MasonryLayout from './masonry-layout'
import Spinner from './spinner'
import { feedQuery, searchQuery } from '../utils/data'

const Feed = () => {
  const [ loading, setLoading ] = useState(false)
  const [ pins, setPins ] = useState(null)
  const { categoryId } = useParams()

  useEffect(() => {
    setLoading(true)

    if (categoryId) {
      const query = searchQuery(categoryId)
      readClient.fetch(query).then((data) => {
        setPins(data)
        setLoading(false)
      })
    } else {
      readClient.fetch(feedQuery).then((data) => {
        setPins(data)
        setLoading(false)
      })
    }
  }, [categoryId])

  if (loading) {
    return (
      <Spinner message="Please wait, We're loading your data!" />
    )
  }

  if (!pins?.length) {
    return (
      <h2>
        No pins available.
      </h2>
    )
  }
  
  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
    </div>
  )
}

export default Feed