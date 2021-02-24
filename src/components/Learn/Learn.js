import React, {Component} from 'react'
import TokenService from '../../services/token-service'
import LanguageService from '../../services/language-service'
import UserContext from '../../contexts/UserContext'
import config from '../../config';
import Loading from '../../Loading/Loading'
import './Learn.css';

class Learn extends Component{
    state = {
        err: null,
        isLoading: true,
    }

    static contextType = UserContext

    componentDidMount(){
        LanguageService.getNextWord
            .then(res => {
                this.context.setNext(res)
                this.setState({isLoading: false})
            })
            .catch(err => this.setState({err}))
    }

    handleClickSubmit=(e)=>{
        LanguageService.setGuess(e.target.value)
        
    }
    render(){
        return (
            <section className='Learn'>

            </section>
        )
    }
}