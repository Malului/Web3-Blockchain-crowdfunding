import React, { useState, useEffect} from 'react'

import { useFundingContext } from '../context'
import { DisplayCampaigns } from '../components';


const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { currentAccount, getUserCampaigns } = useFundingContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await getUserCampaigns();
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
  }, [currentAccount]);

  return (
    <DisplayCampaigns 
      title = "Your Campaigns"
      isLoading = {isLoading}
      campaigns = {campaigns}
    />
  )
}

export default Profile