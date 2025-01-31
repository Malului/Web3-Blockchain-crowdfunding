import React, { useState, useEffect} from 'react'

import { useFundingContext } from '../context'
import { DisplayCampaigns } from '../components';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { currentAccount, getCampaigns } = useFundingContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await getCampaigns();
      setCampaigns(data || []);
    } catch (error) {
      console.log("Eror fetching campaigns: ", error);
    } finally {
      setIsLoading(false);
    }  
  }

  useEffect(() => {
    if (currentAccount) {
      fetchCampaigns();
    }
  }, [currentAccount, getCampaigns]);

  return (
    <DisplayCampaigns 
      title = "All Campaigns"
      isLoading = {isLoading}
      campaigns = {campaigns}
    />
  )
}

export default Home