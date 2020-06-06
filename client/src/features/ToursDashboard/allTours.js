import React, { Component } from 'react';
import { Grid, Container } from 'semantic-ui-react';
import TourList from '../TourList/tourList'

class AllTours extends Component {
    render() {
        return (
            <div>
            <Container>
                <Grid>
                    <Grid.Row>
                        <TourList/>
                    </Grid.Row>
                </Grid>
            </Container>
            </div>
        )
    }
};

export default AllTours;
