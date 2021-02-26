import React, {Component} from 'react'

import LanguageService from '../../services/language-service'
import UserContext from '../../contexts/UserContext'

import Loading from '../Loading/Loading'
import {Label, Input} from '../Form/Form'

import './Learn.css';

class Learn extends Component{
    state = {
        err: null,
        isLoading: true,
        currDisplay: 'question',
    }

    static contextType = UserContext

    componentDidMount(){
        LanguageService.getNextWord()
            .then(res => {
                console.log('mount-res',res)
                this.context.setNext(res)
                this.context.setScore(res.totalScore)
                this.setState({isLoading: false})
            })
            .catch(err => this.setState({err}))
    }

    displayH2Txt=()=>{
        if (this.state.currDisplay === 'question') return 'Translate the word:'
        if (this.state.currDisplay === 'wrong') return 'Good try, but not quite right :('
        if (this.state.currDisplay === 'right') return 'You were correct! :D'
    }
    displayWord=()=>{
        if (this.state.currDisplay === 'question') return this.context.nextWord ? this.context.nextWord.nextWord : null
    }
    displayFeedback=()=>{
        if (this.state.currDisplay === 'question') {
            return (<Label htmlFor='learn-guess-input'>
                        What's the translation for this word?
                    </Label>)
        }
        return (
            <div className='DisplayFeedback'>
                <p>
                    The correct translation for {this.context.currWord.nextWord} was {this.context.nextWord.answer} and you chose {this.context.guess}!
                </p>
            </div>
        )
    }
    displayBtnTxt=()=>{
        return (this.state.currDisplay === 'question') 
                ? 'Submit your answer'
                : 'Try another word!'
    }
    displayCounts=()=>{
        if (this.state.currDisplay === 'question') {
            return (<>
                    <p>You have answered this word correctly {this.context.nextWord ? this.context.nextWord.wordCorrectCount : '?'} times.</p>
                    <p>You have answered this word incorrectly {this.context.nextWord ? this.context.nextWord.wordIncorrectCount : '?'} times.</p>
            </>)
        }
        return (<>
            <p>You have answered this word correctly {this.context.currWord ? this.context.currWord.wordCorrectCount : '?'} times.</p>
            <p>You have answered this word incorrectly {this.context.currWord ? this.context.currWord.wordIncorrectCount : '?'} times.</p>
    </>)
    }
    handleClickSubmit=(e)=>{
        e.preventDefault()
        if (this.state.currDisplay === 'question') {
            const guess = e.target.guess.value.trim()
            if (!guess) {
                alert('Please enter your guess')
            } else {
                this.setState({isLoading: true})
                
                this.context.setCurr(this.context.nextWord)
                this.context.setGuess(guess)

                LanguageService.setGuess(guess)
                .then(res => {
                    this.context.setNext(res)
                    this.context.setScore(res.totalScore)
                    res.isCorrect 
                        ? this.setState({
                            currDisplay: 'right',
                        })
                        : this.setState({
                            currDisplay: 'wrong',
                        })
                })
                .catch(err => console.log(err))
                this.setState({isLoading: false})
            }    
        } else {
            this.setState({isLoading: true})
            LanguageService.getNextWord()
                .then(res => {
                    this.setState({
                        currDisplay: 'question',
                        isLoading: false
                    })
                })
                .catch(err => this.setState({err}))
        }
    }

    render(){
        return (
            <section className='Learn'>
            {this.state.isLoading
                ? <Loading />
                : (<>
                        <h2>{this.displayH2Txt()}</h2>
                        <span className='CurrWord'>{this.displayWord()}</span>    
                        <div className='DisplayScore'><p>Your total score is: {this.context.nextWord ? this.context.score : null}</p></div>
                        <form className="MakeGuess" onSubmit={this.handleClickSubmit}>
                            {this.displayFeedback()}
                            {this.state.currDisplay === 'question' && 
                            <Input
                                id='learn-guess-input'
                                name='guess'
                                placeholder='your answer'
                                required
                            />}
                            <button className='submitBtn' type='submit'>{this.displayBtnTxt()}</button>
                            <p>You have answered this word correctly {this.context.nextWord ? this.context.nextWord.wordCorrectCount : '?'} times.</p>
                            <p>You have answered this word incorrectly {this.context.nextWord ? this.context.nextWord.wordIncorrectCount : '?'} times.</p>
                        </form>
                    
                </>)}
            </section>
        )
    }
}
export default Learn