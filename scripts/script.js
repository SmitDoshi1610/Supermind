import githubApi from './api.js';
import applicationLogic from './controller.js';

const application = {

    stateData : {
        apiData: {
            userdata: {},
            metaData: []
        },
        sortedData: {
            byName: {
                asc: null,
                desc: null
            },
            byStars: {
                asc: null,
                desc: null
            },
            byForks: {
                asc: null,
                desc: null
            },
            byLanguage: {
                asc: null,
                desc: null
            },
            byLastUpdated: {
                asc: null,
                desc: null
            },
        },
        filterBy: {
            languages: [],
        },
        loading: false,
    },

    initialize() {
        const searchBar = document.querySelector('#search-field');

        searchBar.addEventListener('click', async (event) => {
            const searchTerm = '';
            
            this.render.isLoading(true);

            this.stateData.apiData.userdata = await githubApi.fetchUserData(searchTerm);
            console.log(this.stateData.apiData.userdata);
            this.stateData.apiData.metaData = await githubApi.fetchMetaData(searchTerm);
            this.stateData.apiData.metaData = await applicationLogic.parsing.parseData(this.stateData.apiData.metaData);
            
            this.render.isLoading(false);

            // this.render.userData(this.stateData.apiData.userdata);
            this.render.metaData(this.stateData.apiData.metaData);

            this.setControls();
        });
    },

    render: {
        isLoading(value) {
            console.log(value);
        },

        userData(data) {
            const userAvatar = document.querySelector('.user-details__avatar');
            const userName = document.querySelector('.user-details__name');
            const userBio = document.querySelector('.user-details__bio');
            const userId = document.querySelector('.user-details__link');
            const userDetails = document.querySelector('.user-details');
            console.log(data);
            userAvatar.src = data.avatar_url;
            userName.innerHTML = data.name;
            userBio.innerHTML = data.bio;
            userId.href = data.html_url;
            userDetails.classList.remove('hidden');
        },

        metaData(data) {

            if(!data) {
                return;
            }

            let repos = '';

            data.forEach(element => {
                
                const repoData = {
                    name: element.first_name,
                    status: element.subscription["status"],
                    gender: element.gender,
                    credit_card: element.credit_card["cc_number"],
                    address: element.address["city"]
                }

                const repo = `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap font-bold">
                        ${repoData.name}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="px-4 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"> ${repoData.status} </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-3 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"> ${repoData.gender} </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"> ${repoData.credit_card} </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        ${repoData.address}
                    </td>
                </tr>
                `;

                repos+= repo;
            });


            const repoContainer = document.querySelector('.table-rows');
            repoContainer.innerHTML = repos;
        },
    },

    setControls() {
        
        const buttons = {
            'sort-btn__name': 'byName',
            'sort-btn__stars': 'byStars',
            'sort-btn__forks': 'byForks',
            'sort-btn__language': 'byLanguage',
            'sort-btn__lastUpdated': 'byLastUpdated',
        }

        Object.entries(buttons).forEach(([key, value]) => {

            const buttonReference = document.querySelector(`.${key}`);

            buttonReference.addEventListener('click', async (event) => {

                let order = null;

                if(buttonReference.classList.contains('asc')) {
                    order = 'asc';
                    buttonReference.classList.remove('asc');
                    buttonReference.classList.add('desc');
                }
                else {
                    order = 'desc';
                    buttonReference.classList.remove('desc');
                    buttonReference.classList.add('asc');
                }
    
                this.menuLogic.sortBy(value, order);
            });
        });

    },

    menuLogic: {
        
        renderControls: {
            toggleSortButton(handler) {
                const icons = document.querySelectorAll(`.${handler}-btn`);
                
                if(icons[0].classList.contains('hidden')) {
                    icons[0].classList.remove('hidden');
                    icons[1].classList.add('hidden');
                }
                else {
                    icons[0].classList.add('hidden');
                    icons[1].classList.remove('hidden');
                }
            }
            
        },
        
        sortBy(handler, order) {

            let renderData = null;

            if(!application.stateData.sortedData[handler][order]) {
                console.log('Cache Miss :: ' + handler);
                renderData = applicationLogic.sorting.sortBy(handler, application.stateData.apiData.metaData, order);
                application.stateData.sortedData[handler][order] = renderData;
            }
            else {
                console.log('Cache Hit :: ' + handler);
                renderData = application.stateData.sortedData[handler][order];
            }

            application.render.metaData(renderData);
            this.renderControls.toggleSortButton(handler);
        }
    }
}

window.addEventListener('load', () => {
    application.initialize.call(application);
});