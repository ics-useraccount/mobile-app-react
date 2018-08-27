import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { MapView, PolyLine } from 'expo';
import _ from 'underscore';

class MapContainer extends React.Component {
	state = {
		region:{
			longitude: this.props.GPSPoints.GPS[0].Lon,
			latitude: this.props.GPSPoints.GPS[0].Lat,
			longitudeDelta: 1,
			latitudeDelta: 1
		},
		mapLoaded: false,
		gpsPoints: {}
	}
	componentDidMount() {
		this.setState({
			mapLoaded: true
		});

		const finalArray = _.map(this.props.GPSPoints.GPS, function(obj) {
		    return {'latitude': obj.Lat, 'longitude': obj.Lon};
		});
		this.setState({
			gpsPoints: finalArray
		});
	}

	onRegionChangeComplete = (region) => {
		this.setState({ region });
	}; 

	render() {
		console.log(this.props.GPSPoints.GPS);
		if(!this.state.mapLoaded){
			return (
				<View style={{ flex:1, justifyContent: 'center' }}>
					<ActivityIndicator size="large" />
				</View>
			);
		}
		return (
		  <View style={styles.container}>
		    <MapView style={styles.container} region={this.state.region}
		    onRegionChangeComplete={this.onRegionChangeComplete} provider='google'>
		    	{this.props.GPSPoints.GPS.map((marker, index) => {
            		return (
            		<View>
              			<MapView.Marker key={index} coordinate={{
				          	latitude: marker.Lat,
				          	longitude: marker.Lon}} 
            				title={marker.Name}
            				description={marker.Date}>
              			</MapView.Marker>
              			<MapView.Polyline
					          coordinates={this.state.gpsPoints}
					          strokeWidth={10}
					          strokeColor="green"
					          lineCap="round"
					          key={new Date()}
					          />
					</View>
            		);
          		})}
		    </MapView>
		  </View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});


const mapStateToProps = state => {
	return { GPSPoints: state.GPSPoints };
};

export default connect(mapStateToProps)(MapContainer);
