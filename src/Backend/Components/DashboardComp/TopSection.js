import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import SellingGraph from './SellingGraph'
import FourBoxes from './FourBoxes'

const TopSection = () => {
  return (
    <>
        <div>
            <Row>
                <Col md="6"><SellingGraph/></Col>
                <Col md="6"><FourBoxes/></Col>
            </Row>
        </div>
    </>
  )
}

export default TopSection