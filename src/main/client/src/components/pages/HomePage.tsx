
import {DropdownButton} from "../dropdown/DropdownButton.tsx";
import Container from "../Container.tsx";

function HomePage() {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {/*<h1>Home</h1>*/}
            <Container rounded elevation={'8'} style={{margin: '20px', padding: '20px'}}>
                <h1>18px, Bold, 100% lightness</h1>
                <h2>16px, Bold, 100% lightness</h2>
                <p>16px, Regular, 100% lightness</p>
                <p className={'t-secondary'}>16px, Regular, 70% lightness</p>
                <p className={'light t-secondary'}>14px, Regular, 70% lightness</p>

                <DropdownButton label={'Dropdown Button'}></DropdownButton>
            </Container>
        </div>
    )
}

export default HomePage;