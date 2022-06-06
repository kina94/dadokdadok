import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/home/common/navbar/Navbar'
import SearchContainer from './SearchContainer'
import LibraryContainer from './LibraryContainer'
import HistoryContainer from './HistoryContainer'
import Sidebar from '../components/home/common/sidebar/Sidebar'
import MobileNavbar from '../components/mobile/navbar/MobileNavbar'
import './Container.css'
import LoadingSpinner from '../common/utils/LoadingSpinner'
import LocalStorage from '../common/utils/local_storage'
function MainContainer(props) {
    const navigate = useNavigate();
    const location = useLocation()
    // 첫 로그인 시 유저 정보를 세팅합니다.
    const [userInfo, setUserInfo] = useState({})
    // 저장된 책 목록을 세팅합니다.
    const [savedBooks, setSavedBooks] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const FetchSavedBooks = async () => {
        setIsLoading(true)
        const books = await props.bookRepository.syncBooks(userInfo.userId)
        setSavedBooks(books)
        setIsLoading(false)
    }

    useEffect(() => {
        props.authService.onAuthChange(user => {
            if (user) {
                setUserInfo({
                    ...userInfo,
                    userId: user.uid, // 유저 토큰
                    userName: user.displayName, // 유저 이름
                    userEmail: user.email, // 유저 이메일
                    photoURL: '',
                })
                userInfo.userId && props.userRepository.setUserProfile(userInfo.userId,
                    userInfo, props.userRepository.saveUserProfile(userInfo.userId, userInfo))

                userInfo.userId && props.userRepository.loadUserProfile(userInfo.userId, setUserInfo)
            } else {
                navigate('/')
            }
        }, [userInfo.userId])
    }, [props.authService, props.userRepository])

    useEffect(() => {
        FetchSavedBooks()
    }, [userInfo.userId])

    // 서재에 저장된 책 삭제
    const onClickBookDelete = (e) => {
        setSavedBooks(book => {
            const update = { ...book }
            const id = Object.keys(update).filter(key => update[key].isbn === e.target.id)
            delete update[id]
            return update
        })
        props.bookRepository.deleteBook(userInfo.userId, e.target.id)
    }

    // 서재에 저장된 책의 저장된 정보를 수정하거나 책 검색에서 서재에 추가
    const onClickBookUpdateOrAdd = (newBook) => {
        setSavedBooks(book => {
            const update = { ...book }
            const id = Object.keys(update).filter(key => update[key].isbn === newBook.isbn)
            update[id] = newBook
            return update
        })
        props.bookRepository.saveBook(userInfo.userId, newBook.isbn, newBook)
    }

    const onClickSearchNav = () => {
        if (location.pathname.includes('search')) {
            navigate('/home/search')
            LocalStorage.removeAllItems()
        } else {
            const savedParams = JSON.parse(localStorage.getItem('params'))
            const serachURL = savedParams ? `/home/search/${savedParams.query}` : '/home/search'
            navigate(serachURL)
        }
    }

    return (
        <section className='main'>
            {
                isLoading && <LoadingSpinner></LoadingSpinner>
            }
            <Navbar userInfo={userInfo} {...props}></Navbar>
            <Sidebar
                onClickSearchNav={onClickSearchNav}
            ></Sidebar>
            <MobileNavbar
                onClickSearchNav={onClickSearchNav}
                {...props} />
            <section className='content'>
                <Routes>
                    <Route exact={true} path='search/*' element={<SearchContainer
                        savedBooks={savedBooks}
                        userInfo={userInfo}
                        bookRepository={props.bookRepository}
                        onClickBookUpdateOrAdd={onClickBookUpdateOrAdd}
                    />} />
                    <Route exact={true} path='library/*'
                        element={<LibraryContainer
                            userInfo={userInfo}
                            savedBooks={savedBooks}
                            onClickBookDelete={onClickBookDelete}
                            onClickBookUpdateOrAdd={onClickBookUpdateOrAdd}
                            bookRepository={props.bookRepository}
                        />} />
                    <Route exact={true} path='history/*'
                        element={<HistoryContainer
                            userInfo={userInfo}
                            savedBooks={savedBooks}
                            bookRepository={props.bookRepository}
                        />} />
                </Routes>
            </section>
        </section>
    )
}

export default MainContainer