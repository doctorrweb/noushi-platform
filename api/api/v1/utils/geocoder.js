import NodeGeocoder from 'node-geocoder'


const options = {
  provider: process.env.GEOCODER_PROVIDER,
 
  // Optional depending on the providers
  apiKey: process.env.GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
}

const geocoder = NodeGeocoder(options)


const setLocation = async (address) => {
  const loc = await geocoder.geocode(address)
    const location = {
        type: 'Point',
        coor: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
    }

    return location
}

export default setLocation