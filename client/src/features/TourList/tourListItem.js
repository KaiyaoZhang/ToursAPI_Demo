import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Segment, Item, Icon, Button, Modal, Header, Grid, ItemContent} from 'semantic-ui-react';

class TourListItem extends Component {
    render() {
        let stops = ''
        const { 
            imageCover, 
            name, 
            startDates, 
            startLocation, 
            locations,
            maxGroupSize,
            duration,
            difficulty,
            summary,
            price,
            ratingsAverage
        } = this.props.tour;
        
        let description = `${difficulty} ${duration}-day tour`
        let routeName = name.replace(/ /g, '-');
        if(locations.length > 1){
            stops = `${locations.length} stops`
        }else{
            stops = `${locations.length} stop`
        }

        const newDate = moment(startDates[0]).format('MMMM YYYY');
        return (
            <Fragment>
                <Segment.Group>
                    <Segment>
                        <Item.Group>
                            <Item>
                                <Item.Image size="big" src={`/tours/${imageCover}`} />
                            </Item>
                            <Item>
                                <Item.Content>
                                    <Item.Header as={Link} to= {`/tour/${routeName}`} >{name}</Item.Header>
                                </Item.Content>
                            </Item>
                            <Item>
                                <Item.Meta>{description.toUpperCase()}</Item.Meta>
                            </Item>
                            <Item>
                                <Grid>
                                    <Grid.Column width={8}>
                                        <Icon name="marker" color="teal" /> {startLocation.description} 
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        <Icon name="calendar alternate outline"  color="teal"/> {newDate}  
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        <Icon name="flag"  color="teal"/> {stops}
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        <Icon name="users"  color="teal"/> {maxGroupSize} people
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        <Icon name="star"  color="teal"/> {ratingsAverage} rating
                                    </Grid.Column>
                                    <Grid.Column width={8}>
                                        <Icon name="dollar"  color="teal"/> ${price}/person
                                    </Grid.Column>
                                </Grid>        
                            </Item>
                        </Item.Group>
                    </Segment>
                    <Segment>
                        <Item.Description>Summary: {summary}</Item.Description>
                    </Segment>
                </Segment.Group>
            </Fragment>
        )
    }
};

export default TourListItem;
