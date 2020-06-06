import React, {Component, Fragment, useState} from 'react';
import {Segment, 
        Item, 
        Image, 
        Header, 
        Button, 
        Icon,
        Grid
    } from 'semantic-ui-react';
import moment from 'moment';
import Rating from '@material-ui/lab/Rating';
import PhotoSwiper from './PhotoSwiper';

const eventImageStyle = {
    filter: 'brightness(30%)'
};

const eventImageTextStyle = {
    position: 'absolute',
    top: '10%',
    width: '100%',
    height: 'auto'
};

const quickFacts = {
    fontSize: 20, 
    marginLeft:'1%'
}

class TourDetailsHeader extends Component{
    constructor(props){
        super(props);
        this.state = {
            
        };
      }


    render() {
        const { name, 
                imageCover, 
                ratingsAverage, 
                duration, 
                startLocation, 
                difficulty,
                maxGroupSize,
                description,
                startDates,
                guides,
                images
            } = this.props.tour;
        const newDate = moment(startDates && startDates[0]).format('MMMM YYYY');
        return(
            <Fragment>
            <Segment.Group>
                <Segment basic attached="top" style={{ padding: '0' }}>
                    <Image src={`/tours/${imageCover}`} style={eventImageStyle} />
                    <Segment basic style={eventImageTextStyle}>
                        <Item.Group>
                            <Item>
                                <Item.Content>
                                    <Item.Header
                                        style={{ color: 'white', fontSize:80 }}
                                    >
                                        {name}
                                    </Item.Header>
                                    <Item.Description style={{marginTop: '3%'}}>
                                        <Rating readOnly value={ratingsAverage ? ratingsAverage : 0} precision={0.5} size={'large'}/>
                                        <p style={{color: 'white'}}><strong>{ratingsAverage} Ratings!</strong></p>
                                    </Item.Description>
                                    <Item.Description style={{marginTop: '3%'}}>
                                        <Grid>
                                            <Grid.Column width={5}>
                                                <Icon name='clock outline' size={'big'} color={'green'}/>
                                                <span style={{color: 'white'}}><strong>{duration} days</strong></span>
                                            </Grid.Column>
                                            <Grid.Column width={6}>
                                                <Icon name='plane' size={'big'} color={'green'}/>
                                                <span style={{color: 'white'}}><strong>{startLocation && startLocation.description}</strong></span>
                                            </Grid.Column>
                                            <Grid.Column width={5}>
                                                <Icon name='users' size={'big'} color={'green'}/>
                                                <span style={{color: 'white'}}><strong>{maxGroupSize} people group</strong></span>
                                            </Grid.Column>
                                        </Grid>
                                    </Item.Description>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Segment>
                </Segment>
                <Segment>
                    <Grid>
                        <Grid.Column width={8} textAlign={'center'}>
                            <Item.Group>
                                <Item>
                                    <Header style={{fontSize: 30, marginBottom: '2%', color: 'green'}}>
                                        QUICK FACTS
                                    </Header>
                                </Item>
                                <Item>
                                    <Icon 
                                        name="calendar alternate outline"  
                                        color="teal" 
                                        size={'big'}
                                        style={{marginBottom:'2%'}}
                                    /> 
                                    <span style={quickFacts}><strong>START DATE</strong> {newDate}</span>
                                </Item>
                                <Item>
                                    <Icon 
                                        name="chart line"  
                                        color="teal" 
                                        size={'big'}
                                        style={{marginBottom:'2%'}}
                                    /> 
                                    <span style={quickFacts}><strong>DIFFICULTY</strong> {difficulty}</span>
                                </Item>
                                <Item>
                                    <Icon 
                                        name="thumbs up"  
                                        color="teal" 
                                        size={'big'}
                                        /> 
                                    <span style={quickFacts}><strong>HIGHLY RECOMMENDED!</strong></span>
                                </Item>
                            </Item.Group>
                        </Grid.Column>
                        <Grid.Column width={8} textAlign={'left'}>
                            <Item>
                                <Item.Content>
                                    <Item.Header style={{fontSize: 30, marginBottom: '2%', color: 'green'}}>
                                        <span><strong>Tour Description:</strong></span>
                                    </Item.Header>
                                    <Item.Description style={{fontSize: 20, lineHeight: 1.8}}>
                                        {description}
                                    </Item.Description>
                                </Item.Content>
                            </Item>
                        </Grid.Column>
                    </Grid>
                </Segment>
                <Segment>
                    <Grid>
                        {guides && guides.map((el, index) => (
                            <Grid.Column width={5} key={index}>
                                <Item.Group>
                                    <Item>
                                        <Item.Image size='medium' circular src={`/users/${el.photo}`} />
                                        <Item>
                                            <Item.Content>
                                                <Item.Header>{el.role.toUpperCase()}</Item.Header>
                                                <Item.Description as="a">
                                                    {el.name}
                                                </Item.Description>
                                            </Item.Content>
                                        </Item>
                                    </Item>
                                    
                                </Item.Group>
                            </Grid.Column>
                        ))}
                    </Grid>
                </Segment>
                <Segment>
                    <PhotoSwiper images={images}/>
                </Segment>
            </Segment.Group>
        </Fragment>
        )
    }
}

export default TourDetailsHeader;
