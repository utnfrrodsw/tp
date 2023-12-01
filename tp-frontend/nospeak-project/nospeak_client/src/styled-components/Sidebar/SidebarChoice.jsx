import React from 'react'
import { Choices } from './styles'


const SidebarChoice = ({title,Icon, onClick}) => {
    return (
        <Choices onClick={onClick}>
            {Icon && <Icon/> }
            {Icon ? <h4>{title}</h4> : <p>{title}</p>}
        </Choices>
    )
}

export default SidebarChoice