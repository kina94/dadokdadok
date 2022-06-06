import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {bookActions} from '../../../../modules/actions'
import BookSave from '../../common/book/BookSave'

function SavedBookContents(props) {
    const dispatch = useDispatch()

    const onClickDelete = (e) => {
        if (window.confirm('정말 삭제하시겠어요?')) {
          dispatch(bookActions.onClickBookDelete(e.target.id, props.userInfo.userId))
          alert('삭제가 완료되었습니다.')
          props.setIsToggle(false)
        }
      }

    // 좀 더 깔끔하게 만들 수 있는 방법 생각 필요
    const viewChangeByType = (type) => {
        switch (type) {
            case 'complete':
                return (
                    <form>
                        <i id='icon' className="fas fa-calendar-check"></i>
                        <p>독서기간</p>
                        <div className='option-container' id='option-saved'>
                            <span>시작일</span>
                            <span id='view'>{props.selectedBook.startDate}</span>
                        </div>
                        <div className='option-container' id='option-saved'>
                            <span>종료일</span>
                            <span id='view'>{props.selectedBook.endDate}</span>
                        </div>
                        <i id='icon' className="fas fa-pencil"></i>
                        <p>후기</p>
                        <div className='option-container' id='option-saved'>
                            <span id='view'>{props.selectedBook.review}</span>
                        </div>
                    </form>
                )
            case 'reading':
                return (
                    <form>
                        <i id='icon' className="fas fa-calendar-check"></i>
                        <p>독서기간</p>
                        <div className='option-container' id='option-saved'>
                            <span>시작일</span>
                            <span id='view'>{props.selectedBook.startDate}</span>
                        </div>
                        <div>
                        </div>
                        <i id='icon' className="fas fa-pencil"></i>
                        <p>메모</p>
                        <div className='option-container' id='option-saved'>
                            <span id='view'>{props.selectedBook.memo}</span>
                        </div>
                    </form>
                )
            case 'want':
                return (
                    <div>
                        <form>
                            <i id='icon' className="fas fa-pencil"></i>
                            <p>메모</p>
                            <div className='option-container' id='option-saved'>
                                <span id='view'>{props.selectedBook.memo}</span>
                            </div>
                        </form>
                    </div>
                )
        }
    }

    const updateBookContents = (newBook) => {
        props.setSelectedBook(newBook)
        props.setModifyMode(false)
    }
    
    return (
        <>
            {
                props.modifyMode ? <BookSave modifyMode={props.modifyMode}
                    selectedBook={props.selectedBook}
                    savedBooks={props.savedBooks}
                    userInfo={props.userInfo}
                    updateBookContents={updateBookContents}
                /> :
                    <section className='save-contents'>
                        <section className='selected-display'>
                            {viewChangeByType(props.selectedBook.type)}
                            <div className='button-container'>
                                <button onClick={()=>props.setModifyMode(true)}>수정</button>
                                <button className='delete' id={props.selectedBook.isbn} onClick={onClickDelete}>삭제</button>
                            </div>
                        </section>
                    </section>
            }
        </>
    )
}

export default SavedBookContents