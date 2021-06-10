
const mapDispatchToProps = (dispatch) => {
    return {
        saveCredentials: (credentials) => {dispatch({type:'LOGIN_SUCCESS', credentials:credentials})}
    }
}

const mapStateToProps = (state) => {

}

export default {mapDispatchToProps,mapStateToProps};