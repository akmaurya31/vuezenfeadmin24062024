import React from 'react'
import BestSellingProducts from './BestSellingProducts'
import { Col, Row } from 'react-bootstrap'

const SectionTwo = () => {
  return (
    <div className='Sectiontwo'>
        <Row>
            <Col md="6"><BestSellingProducts/></Col>
            <Col md="6"></Col>
        </Row>
    </div>
  )
}

export default SectionTwo