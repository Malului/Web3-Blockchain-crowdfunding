import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DisplayCampaigns } from '../components'
import { useFundingContext } from '../context'

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  
  const { getCampaigns } = useFundingContext();

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const allCampaigns = await getCampaigns();
        // Filter campaigns based on search query
        const filteredCampaigns = allCampaigns.filter(campaign => 
          campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setCampaigns(filteredCampaigns);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchQuery) {
      fetchCampaigns();
    }
  }, [searchQuery, getCampaigns]);

  return (
    <div>
      <DisplayCampaigns 
        title={`Search Results for ${searchQuery}`}
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </div>
  )
}

export default SearchResults